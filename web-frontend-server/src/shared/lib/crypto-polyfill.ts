// Polyfill for Web Crypto API in insecure contexts (HTTP over IP/domain).
// Modern browsers disable crypto.randomUUID and crypto.subtle in non-secure contexts.
// Keycloak JS (pkce S256) relies on crypto.randomUUID() and crypto.subtle.digest('SHA-256', data).

function r(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n))
}

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]

export function sha256(data: ArrayBuffer | Uint8Array | ArrayBufferView): ArrayBuffer {
  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a,
    h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19

  const b =
    data instanceof Uint8Array
      ? data
      : data instanceof ArrayBuffer
        ? new Uint8Array(data)
        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength)

  const l = b.length
  const n = (((l + 8) >> 6) + 1) << 6
  const msg = new Uint8Array(n)
  msg.set(b)
  msg[l] = 0x80
  const dv = new DataView(msg.buffer)
  dv.setUint32(n - 4, (l * 8) >>> 0, false)
  dv.setUint32(n - 8, Math.floor((l * 8) / 0x100000000), false)

  const w = new Uint32Array(64)
  for (let i = 0; i < n; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4, false)
    for (let j = 16; j < 64; j++) {
      const s0 = r(7, w[j - 15]) ^ r(18, w[j - 15]) ^ (w[j - 15] >>> 3)
      const s1 = r(17, w[j - 2]) ^ r(19, w[j - 2]) ^ (w[j - 2] >>> 10)
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0
    }
    let a = h0,
      b_ = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7
    for (let j = 0; j < 64; j++) {
      const S1 = r(6, e) ^ r(11, e) ^ r(25, e)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0
      const S0 = r(2, a) ^ r(13, a) ^ r(22, a)
      const maj = (a & b_) ^ (a & c) ^ (b_ & c)
      const temp2 = (S0 + maj) >>> 0
      h = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b_
      b_ = a
      a = (temp1 + temp2) >>> 0
    }
    h0 = (h0 + a) >>> 0
    h1 = (h1 + b_) >>> 0
    h2 = (h2 + c) >>> 0
    h3 = (h3 + d) >>> 0
    h4 = (h4 + e) >>> 0
    h5 = (h5 + f) >>> 0
    h6 = (h6 + g) >>> 0
    h7 = (h7 + h) >>> 0
  }
  const res = new ArrayBuffer(32)
  const out = new DataView(res)
  out.setUint32(0, h0, false)
  out.setUint32(4, h1, false)
  out.setUint32(8, h2, false)
  out.setUint32(12, h3, false)
  out.setUint32(16, h4, false)
  out.setUint32(20, h5, false)
  out.setUint32(24, h6, false)
  out.setUint32(28, h7, false)
  return res
}

export function polyfillCrypto() {
  if (typeof window === 'undefined') return

  const target = window.crypto || ((window as any).crypto = {})

  if (!target.randomUUID) {
    const randomUUID = function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
      if (typeof target.getRandomValues === 'function') {
        const bytes = new Uint8Array(16)
        target.getRandomValues(bytes)
        bytes[6] = (bytes[6] & 0x0f) | 0x40
        bytes[8] = (bytes[8] & 0x3f) | 0x80
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}` as `${string}-${string}-${string}-${string}-${string}`
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }) as `${string}-${string}-${string}-${string}-${string}`
    }

    try {
      target.randomUUID = randomUUID
    } catch {
      try {
        Object.defineProperty(target, 'randomUUID', {
          value: randomUUID,
          writable: true,
          configurable: true,
        })
      } catch {
        // ignore
      }
    }
  }

  if (!target.subtle) {
    const subtle = {
      async digest(_algo: any, data: BufferSource): Promise<ArrayBuffer> {
        return sha256(data)
      },
    }

    try {
      ;(target as any).subtle = subtle as SubtleCrypto
    } catch {
      try {
        Object.defineProperty(target, 'subtle', {
          value: subtle,
          writable: true,
          configurable: true,
        })
      } catch {
        try {
          const proto = Object.getPrototypeOf(target)
          if (proto) {
            Object.defineProperty(proto, 'subtle', {
              value: subtle,
              writable: true,
              configurable: true,
            })
          }
        } catch {
          // ignore
        }
      }
    }
  }
}

polyfillCrypto()
