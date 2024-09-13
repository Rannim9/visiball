import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js'; 

export const authentificate = async (req, res, next) => {
  const nonSecurePaths = ['/contactmsyt/forgot-password', '/contactmsyt/reset-password'];

  if (nonSecurePaths.includes(req.path)) {
    return next();
  }

  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).send({ error: 'Token non fourni. Veuillez vous authentifier.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await UserModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).send({ error: 'Aucun utilisateur trouvé avec ce token.' });
    }

    if (!user.activated) {
      return res.status(403).send({ error: 'Le compte utilisateur est désactivé.' });
    }

    req.user = user;  
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Le token a expiré. Veuillez vous reconnecter.' });
    }
    console.error("Erreur de vérification du token: ", error);
    res.status(401).send({ error: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};
