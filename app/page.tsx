export default function Home() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark cinematic overlay — top-to-bottom gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      {/* Radial vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)]" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Eyebrow label */}
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] uppercase text-white/50">
          Experience the difference
        </p>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Crafted for the{" "}
          <span className="italic font-light text-white/80">extraordinary</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
          A new standard of cinematic precision — where every frame tells a story.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button className="px-8 py-3 text-sm font-semibold tracking-widest uppercase text-black bg-white rounded-full transition-all duration-300 hover:bg-white/90 hover:scale-105 active:scale-100">
            Get Started
          </button>
          <button className="px-8 py-3 text-sm font-semibold tracking-widest uppercase text-white/80 border border-white/30 rounded-full backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:text-white hover:scale-105 active:scale-100">
            Watch Film
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
