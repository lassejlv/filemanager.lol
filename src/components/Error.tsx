export default function Error({ error }: { error: Error }) {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='text-red-500'>{error.message}</div>
    </div>
  )
}
