export const SPACE_LEVEL_ENUM = {
  COMMON: 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2,
}

export const SPACE_LEVEL_MAP = {
  0: '普通版',
  1: '专业版',
  2: '旗舰版',
}

// 修正 OPTIONS 的类型
export const SPACE_LEVEL_OPTIONS = Object.entries(SPACE_LEVEL_MAP).map(([value, label]) => ({
  label,
  value: Number(value), // 转换为数字类型
}))
