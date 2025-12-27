import { Link } from "react-router";

/**
 * Halaman yang ditampilkan ketika pengguna mencoba mengakses rute
 * yang tidak sesuai dengan role mereka.
 * @param {string} userRole - Role pengguna saat ini.
 */
const Unauthorized = ({ userRole }: { userRole: string | string[] }) => {
  return (
    // Container utama: Penuh layar, flex, center, background abu-abu terang
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100 font-sans">
      {/* Kartu pesan Unauthorized */}
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center border-t-4 border-red-500">
        {/* Ikon dan Judul */}
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-red-600 mb-6">
          Akses Ditolak
        </h2>

        {/* Pesan Keterangan Role */}
        <p className="text-lg text-gray-600 mb-4">
          Anda telah berhasil masuk, tetapi akun Anda dengan role
          <span className="font-bold text-red-500 mx-1">
            "{userRole || "Tidak Teridentifikasi"}"
          </span>
          tidak memiliki izin untuk melihat halaman ini.
        </p>

        {/* Petunjuk */}
        <p className="text-sm text-gray-400 mb-8">
          Silakan kembali ke beranda atau hubungi administrator sistem.
        </p>

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
