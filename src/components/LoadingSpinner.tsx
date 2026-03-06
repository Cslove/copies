export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2c2c2c]"></div>
    </div>
  )
}
