  "use client";

  import { useRouter } from "next/navigation";

  export default function SellCTA() {
    const router = useRouter();

    return (
      <div className="max-w-7xl mx-auto ">

        <div
          className="
          relative overflow-hidden
          rounded-3xl
          px-4 sm:px-10 py-10 sm:py-14
          text-center
          shadow-lg

        "
        >

          {/* Background Image */}
          <img
            src="/images/sell_placeholder.png"
            alt="sell background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />


          {/* Content */}
          <div className="relative z-10">

            <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white mb-6">
              Have something to sell?
            </h2>

            <button
              onClick={() => router.push("/create")}
              className="
                bg-white text-indigo-700
                px-8 py-3
                rounded-xl
                font-medium
                shadow-md
                hover:scale-105 hover:shadow-lg
                transition-all duration-300
              "
            >
              Post Your Listing
            </button>

          </div>

        </div>

      </div>
    );
  }