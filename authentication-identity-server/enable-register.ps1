$ErrorActionPreference = 'Stop'

$container = if ($env:KEYCLOAK_CONTAINER) { $env:KEYCLOAK_CONTAINER } else { 'authentication-identity-server' }
$adminUser = if ($env:KC_BOOTSTRAP_ADMIN_USERNAME) { $env:KC_BOOTSTRAP_ADMIN_USERNAME } else { 'admin' }
$adminPass = if ($env:KC_BOOTSTRAP_ADMIN_PASSWORD) { $env:KC_BOOTSTRAP_ADMIN_PASSWORD } else { 'admin' }
$demoUser = if ($env:DEMO_USERNAME) { $env:DEMO_USERNAME } else { 'student_demo' }
$demoPass = if ($env:DEMO_PASSWORD) { $env:DEMO_PASSWORD } else { '123456' }

Write-Host "Authenticating kcadm inside $container ..."
& docker exec $container /opt/keycloak/bin/kcadm.sh config credentials `
    --server http://localhost:8080 `
    --realm master `
    --user $adminUser `
    --password $adminPass
if ($LASTEXITCODE -ne 0) { throw "Failed to authenticate with Keycloak inside $container." }

Write-Host "Enabling registrationAllowed=true on realm minicloud ..."
& docker exec $container /opt/keycloak/bin/kcadm.sh update realms/minicloud `
    -s registrationAllowed=true `
    -s loginWithEmailAllowed=true `
    -s duplicateEmailsAllowed=false
if ($LASTEXITCODE -ne 0) { throw "Failed to update realm minicloud." }

$existing = & docker exec $container /opt/keycloak/bin/kcadm.sh get users -r minicloud -q "username=$demoUser"
if ($existing -notmatch "`"username`"\s*:\s*`"$demoUser`"") {
    Write-Host "Creating demo user $demoUser ..."
    & docker exec $container /opt/keycloak/bin/kcadm.sh create users -r minicloud `
        -s "username=$demoUser" `
        -s "email=user@minicloud.local" `
        -s "firstName=Student" `
        -s "lastName=Demo" `
        -s enabled=true `
        -s emailVerified=true
    if ($LASTEXITCODE -ne 0) { throw "Failed to create demo user $demoUser." }
}

Write-Host "Setting password for $demoUser ..."
& docker exec $container /opt/keycloak/bin/kcadm.sh set-password -r minicloud `
    --username $demoUser `
    --new-password $demoPass
if ($LASTEXITCODE -ne 0) { throw "Failed to set password for $demoUser." }

Write-Host "Done. Realm minicloud now has registrationAllowed=true and demo user $demoUser."

