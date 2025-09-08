const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // keep in sync with env
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

const clearAccessCookie = (res) => {
  res.clearCookie("accessToken", {
    secure: false,
    sameSite: "lax",
  });
};

module.exports = { setRefreshCookie, clearRefreshCookie, clearAccessCookie };
