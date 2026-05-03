export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    res.status(statusCode).cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }).json({
        success: true,
        message,
        user,
        token,
    });
};
// export const generateToken = (user, message, statusCode, res) => {
//   const token = user.generateJsonWebToken();

//   res
//     .status(statusCode)
//     .cookie("token", token, {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//       secure: false,          // ✅ for localhost
//       sameSite: "none",       // 🔥 THIS IS THE FIX
//     })
//     .json({
//       success: true,
//       message,
//       user,
//       token,
//     });
// };