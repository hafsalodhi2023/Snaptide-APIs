const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // keep in sync with env
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};

const clearAccessCookie = (res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "strict",
  });
};

module.exports = { setRefreshCookie, clearRefreshCookie, clearAccessCookie };
