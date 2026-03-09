export const handleError = (error: unknown, context: string): void => {
  console.error(`${context}:`, error)
}

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  return error instanceof Error ? error.message : defaultMessage
}
