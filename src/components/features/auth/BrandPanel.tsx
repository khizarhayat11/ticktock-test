export function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#1a6bff] px-16 py-12 text-white">
      <div />

      <div className="space-y-4 w-full">
        <h2 className="text-5xl font-semibold tracking-tight">ticktock</h2>
        <p className="text-base text-white/80 leading-relaxed">
          Introducing ticktock, our cutting-edge timesheet web application
          designed to revolutionize how you manage employee work hours. With
          ticktock, you can effortlessly track and monitor employee attendance
          and productivity from anywhere, anytime, using any internet-connected
          device.
        </p>
      </div>

      <p className="text-sm text-white/50">© {new Date().getFullYear()} ticktock</p>
    </div>
  )
}
