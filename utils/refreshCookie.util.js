const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
};

const clearAccessCookie = (res) => {
  res.clearCookie("accessToken", {
    secure: false,
    sameSite: "lax",
    path: "/",
  });
};

module.exports = { setRefreshCookie, clearRefreshCookie, clearAccessCookie };
