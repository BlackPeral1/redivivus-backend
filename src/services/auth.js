import bcrypt from 'bcrypt'
import { createCustomer , getOneCustomer} from '../repository/customer'

export const authRegister = async ( userDetails ) => {
  let user = await getOneCustomer({ email: userDetails.email }, false)

  if (user?._id.toString() !== userDetails._id)
      return { status: 400, message: 'Email is already taken' }


  const encryptedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(userDetails.password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
          if (err) reject(err)
          resolve(hash)
      })
  })

  const newCustomer = await createCustomer({
      ...userDetails,
      password: encryptedPassword,
      is_verified: true,
      role: 'Customer',
  })

  return newCustomer
}

export const authLogin = async ({ email, password }) => {
  const user = await getOneCustomer({ email }, true)
  if (!user) return false
  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  if (!isPasswordMatch) return false
  delete user.password
  return user
}

// export const verifyMailTemplate = async (email, verification_code) => {
//   const replacements = {
//     verify_url: `${process.env.APP_DOMAIN}/api/auth/verify/${verification_code}`
//   }
//   const attachments = [
//     {
//       filename: 'bashawayLogo',
//       path: __basedir + '/html/images/bashawayLogo.png',
//       cid: 'bashawayLogo'
//     },
//     {
//       filename: 'fossLogo',
//       path: __basedir + '/html/images/fossLogo.png',
//       cid: 'fossLogo'
//     }
//   ]
//   const subject = 'Welcome to the Bashaway'
//   await sendMail(email, 'verifyRegistration', replacements, subject, attachments)
//   return true
// }

// export const updateVerificationStatus = async (verificationCode) => {
//   const user = await getOneCustomer({ verification_code: verificationCode })
//   if (!user) return false
//   return await findOneAndUpdateCustomer({ email: user.email }, { is_verified: true })
// }

// export const authResendVerification = async (email) => {
//   const user = await getOneCustomer({ email })
//   if (!user) return { status: 400, message: 'A user/group by the provided email does not exist' }
//   const verification_code = uuidv4()
//   const updatedCustomer = await findOneAndUpdateCustomer({ email }, { verification_code })
//   await verifyMailTemplate(email, verification_code)
//   return updatedCustomer
// }

// export const resetPasswordMailTemplate = async (email, verification_code) => {
//   const replacements = {
//     verify_url: `${process.env.FRONTEND_DOMAIN}/forgot_password/${verification_code}`
//   }
//   const attachments = [
//     {
//       filename: 'bashawayLogo',
//       path: __basedir + '/html/images/bashawayLogo.png',
//       cid: 'bashawayLogo'
//     },
//     {
//       filename: 'fossLogo',
//       path: __basedir + '/html/images/fossLogo.png',
//       cid: 'fossLogo'
//     }
//   ]
//   const subject = 'Welcome to Bashaway'
//   await sendMail(email, 'resetPassword', replacements, subject, attachments)
//   return true
// }

// export const forgotPasswordEmail = async (email) => {
//   const user = await getOneCustomer({ email })
//   if (!user) return { status: 400, message: 'A user/group by the provided email does not exist' }
//   const verification_code = uuidv4()
//   const updatedCustomer = await findOneAndUpdateCustomer({ email }, { verification_code })
//   await resetPasswordMailTemplate(email, verification_code)
//   return updatedCustomer
// }

// export const resetPasswordFromEmail = async (password, verificationCode) => {
//   const user = await getOneCustomer({ verification_code: verificationCode })
//   if (!user) return { status: 400, message: 'Click the link we have sent to your email and try again.' }

//   const encryptedPassword = await new Promise((resolve, reject) => {
//     bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
//       if (err) reject(err)
//       resolve(hash)
//     })
//   })
//   const updatedCustomer = await findOneAndUpdateCustomer({ email: user.email }, { password: encryptedPassword, is_verified: true })
//   return updatedCustomer
// }