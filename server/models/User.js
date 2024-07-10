import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true 
    },
    resetPasswordToken: {
         type: String,
          default: '' 
        },
    resetPasswordExpires: {
         type: Date 
        },
    
    role: { 
        type: String,
        required: true,
        enum: ['client', 'admin'],  
        default: 'client'           
    }
});
const setUserInfo = ({ name, email, token }) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('token', token); 
  };
  
  const clearUserInfo = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
  };
  const getUserInfo = () => {
    return {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
    };
  };
  

const UserModel = mongoose.model("User", UserSchema);

export { UserModel, getUserInfo, setUserInfo, clearUserInfo };

  
  
  