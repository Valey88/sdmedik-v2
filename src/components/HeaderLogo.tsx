import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <>
      <Link to="/" className="flex w-full md:w-xs items-center space-x-2">
        <div
          className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)",
          }}
        >
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">SdMedik</h3>
          <p className="text-xs text-gray-600">Медицинская техника</p>
        </div>
      </Link>
    </>
  );
};

export default HeaderLogo;
