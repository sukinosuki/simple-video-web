/**
 * Author: hanami
 * Date: 2023-03-17 18:11:55
 * Description: TabStatus.ts
 */

import type { PageStatus } from './enum'

export interface TabStatus<T> {
  isFinished: boolean
  loading: boolean
  data: T[]
  refreshing: boolean
  page: number
  pageStatus: PageStatus
}
