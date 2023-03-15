/**
 * Author: hanami
 * Date: 2023-03-14 18:24:16
 * Description: toast.ts
 */

import { Snackbar } from '@varlet/ui'

const TOAST_DURATION = 1500

//
export const toast = (msg: string) => {
  return new Promise((resolve) => {
    const snackbar = Snackbar({
      position: 'center',
      content: msg,
      forbidClick: true,
      duration: TOAST_DURATION,

    })

    setTimeout(() => {
      resolve(snackbar)
    }, TOAST_DURATION)
  })
}
