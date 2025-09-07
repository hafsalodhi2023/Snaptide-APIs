const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false, // set true in prod (HTTPS)
    sameSite: "none", // to allow cross-site (React on different origin)
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // keep in sync with env
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });
};

module.exports = { setRefreshCookie, clearRefreshCookie };
