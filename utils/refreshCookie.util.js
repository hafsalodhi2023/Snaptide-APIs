const isProd = process.env.NODE_ENV === "production";

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};

const clearAccessCookie = (res) => {
  res.clearCookie("accessToken", {
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};

module.exports = { setRefreshCookie, clearRefreshCookie, clearAccessCookie };
