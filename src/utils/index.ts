/**
 * Author: hanami
 * Date: 2021-07-08 10:20:02
 * Description: index.ts
 */

// to catch
export const toCatch = <T>(fn: Promise<AppResponse<T>>): Promise<[Error | null, T]> =>
  // @ts-expect-error
  fn.then((res) => {
    const { code, msg } = res
    if (code !== 0)
      throw new Error(msg)

    return [null, res.data]
  })
    .catch((err: AppResponse) => {
      // console.log('[toCatch] err.message ', err.message)

      console.log('[toCatch] err ', err)
      return [Error(err.msg), err]
    })

// sleep
export const sleep = (duration = 300) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(null)
  }, duration)
})

// 字符串转对象
// e.g.
// const s = code=222?222?&name=hanami
// const obj = searchToQuery(s)
//
// obj.code -> 222?222?
// obj.name -> hanami
export function searchToQuery<T = {}>(search: string): T {
  const s = search.replace(/^\?/, '')

  const o = s.split('&').reduce((acc: any, next) => {
    const [k, v] = next.split('=')
    acc[k] = v
    return acc
  }, {})

  return o
}
