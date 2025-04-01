export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_REVIEW_STATUS_MAP = {
  0: '待审核',
  1: '通过',
  2: '不通过',
}

// 修正 OPTIONS 的类型
export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(
  ([value, label]) => ({
    label,
    value: Number(value), // 转换为数字类型
  }),
)
