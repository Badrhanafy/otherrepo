import express, { query } from "express"
import multer from "multer";
import mysql from "mysql2"
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { connect } from "http2";
import { type } from "os";
const app = express();
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
 jwt.verify(token, 'thissvevehjvebvjehjb43r32r2fbf', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next(); 
  });
  
};
const PORT = 3999;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  
    password: "",
    database: "schools",
});

// تعريف __dirname في ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database.");
    }
});

// Middleware
app.use(cors({
  origin:"http://localhost:3000"
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Add new school route
app.post("/add-school",upload.single("image"), (req, res) => {
  const { nomecole, dd_construction, adress, statut, type ,direction} = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

 
  if (!nomecole || !dd_construction || !adress || !statut || !type , !direction) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO ecole (nomecole, dd_construction, adress, statut, typeecole, image, direction) 
    VALUES (?, ?, ?, ?, ?, ?,?)
  `;
  const values = [nomecole, dd_construction, adress, statut, type, image ,direction];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding school:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "School added successfully." });
  });
});

// show school by id
app.get("/school/:idecole", (req, res) => {
    const { idecole } = req.params;
  
    const query = "SELECT * FROM ecole WHERE idecole = ?";
    db.query(query, [idecole], (err, result) => {
      if (err) {
        console.error("Error fetching school by idecole:", err);
        res.status(500).json({ error: "Failed to fetch school." });
      } else if (result.length === 0) {
        res.status(404).json({ error: "School not found." });
      } else {
        res.status(200).json(result[0]); 
      }
    });
  });
// afficher les ecoles pour home page
app.get("/schools",(req, res) => {
    const query = "SELECT * FROM ecole";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});





///////////////////// taskecole



app.get('/tache/:idecole', (req, res) => {
    const { idecole } = req.params;
  
    const query = 'SELECT * FROM tache WHERE idecole = ?';
  
    db.execute(query, [idecole], (err, results) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No tasks found for this school' });
      }
  
      res.json(results);
    });
  });

  //////////////////////////////////////
  app.post("/tache", (req, res) => {
    const { nomtache, category, sub_category, t_pourcentage,datedebut,datefin, idecole } = req.body;
  
    const reqet = `
      INSERT INTO tache (nomtache, category, sub_category, t_pourcentage,datedebut,datefin, idecole)
      VALUES (?, ?, ?, ?, ?,?,?)
    `;
  
    db.query(reqet, [nomtache, category, sub_category, t_pourcentage,datedebut || null,datefin || null, idecole], (err, results) => {
      if (err) {
        console.error("Error adding task: ", err);
        return res.status(500).send("Error adding task");
      }
  
      res.status(201).send("Task added successfully");
    });
  });
  ///////////////////////  ajouter une tache! 

app.post('/submitTasks', (req, res) => {
  const { tasks,idecole } = req.body;

  // الحصول على التاريخ الحالي
  const startDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // تنسيق التاريخ إلى 'YYYY-MM-DD HH:MM:SS'
  const endDate = null; // تاريخ النهاية سيكون null في البداية

  // تنفيذ الاستعلام لإضافة المهام
  tasks.forEach((task) => {
    const { nomtache, category, sub_category, t_pourcentage, idecole } = task;

    const query = `
      INSERT INTO tache (nomtache, category, sub_category, t_pourcentage, datedebut, datefin, idecole)
VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nomtache, category, sub_category, t_pourcentage, startDate, endDate, idecole], (err, result) => {
      if (err) {
        console.error('خطأ في إضافة المهمة:', err);
        return res.status(500).json({ error: 'خطأ في إضافة المهمة' });
      }
    });
  });

  // 
  res.status(200).json({ message: 'تم إضافة المهام بنجاح' });
});


//////////////////// check if task already exists
app.get('/getTasksBySchool/:idecole', (req, res) => {
  const { idecole } = req.params;

  const query = `SELECT nomtache, category, sub_category FROM tache WHERE idecole = ?`;

  db.query(query, [idecole], (err, results) => {
    if (err) {
      console.error('خطأ في جلب المهام:', err);
      return res.status(500).json({ error: 'خطأ في جلب المهام' });
    }
    res.status(200).json(results);
  });
});
//////////////////// Add admin route 


app.post('/add-admin', async (req, res) => {
  const { fullname, email, pwd } = req.body;

  if (!fullname || !email || !pwd) {
      return res.status(400).json({ message: 'All fields are required' });
  }
  const hashedPassword = await bcrypt.hash(pwd, 10)
  const sql = 'INSERT INTO admin (fullname, email, pwd) VALUES (?, ?, ?)';
  db.query(sql, [fullname, email, hashedPassword], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Admin added successfully' });
  });
});



 // Login route
app.post('/login', async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  const sql = 'SELECT * FROM admin WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = results[0]
    const isMatch = await bcrypt.compare(pwd, admin.pwd);
 if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const key = 'thissvevehjvebvjehjb43r32r2fbf' 
    const token = jwt.sign(
      { idadmin: admin.idadmin, email: admin.email },key);
    res.status(200).json({
      message: 'Login successful',
      token,admin: {
        idadmin: admin.idadmin,
        fullname: admin.fullname,
        email: admin.email,
      },
    });
  });
});

/////////////////// update schoole infos
app.put("/school/:idecole", (req, res) => {
  const { idecole } = req.params;
  const { nomecole, adress, statut, pourcentage ,typeecole} = req.body;
  if (!nomecole || !adress || !statut || pourcentage === undefined || !typeecole) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = ` UPDATE ecole SET nomecole = ?, adress = ?, statut = ?, pourcentage = ? , typeecole = ? WHERE idecole = ?
  `;
  const values = [nomecole, adress, statut, pourcentage,typeecole, idecole];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating school:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "School not found." });
    }
    res.status(200).json({ message: "School information updated successfully." });
  });
});
////////// Ajouter user
app.post("/ajouterUser" ,(req, res) => {
  const { nomemployer, login, pwd, poste } = req.body;
  if (!nomemployer || !login || !pwd || !poste) {
    return res.status(400).json({ error: "All fields are required." });
  }
  // SQL query with placeholders to avoid SQL injection
  const query = `
    INSERT INTO employer(nomemployer, login, pwd, employer_poste)
    VALUES (?, ?, ?, ?)
  `;

  const values = [nomemployer, login, pwd, poste];
  db.query(query, values, (err, result) => {
    if (err) {
 console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Failed to add user. Please try again later." });
    }
    return res.status(201).json({ message: "User added successfully", userId: result.insertId });
  });
});
////////////////////// add images
app.post('/school/:idecole/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('لم يتم رفع أي صورة');
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const idecole = req.params.idecole;

  // Insert image info into the database
  const query = 'INSERT INTO ecole_images (idecole, image_url) VALUES (?, ?)';
  db.execute(query, [idecole, imagePath], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('حدث خطأ أثناء إضافة الصورة');
    }

    // Send response with the image path
    res.status(200).send({ imagePath: imagePath });
  });
});
////////////////////// get the images for eaaaach eocle 
app.get("/ecoles/:idecole/images", (req, res) => {
  const idecole = req.params.idecole;
  if (!idecole) {
    return res.status(400).json({ message: "L'identifiant de l'école est requis." });
  }
  // Requête SQL
  const sql = `
    SELECT ei.idimage, ei.image_url
    FROM ecole_images ei
    WHERE ei.idecole = ?
  `;
  db.query(sql, [idecole], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des images :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Aucune image trouvée pour cette école." });
    }
    res.status(200).json(results);
  });
});


///////// supprimer une tache d'apres une ecole id
app.delete("/delete/:idecole/:idtache",(req,res)=>{
  const {idecole,idtache} = req.params
  if (!idecole & !idtache) {
      res.status(400).send("bad request !")
  }
  else{
    const query = `delete from tache where idecole=? and idtache=?`;
    const values = [idecole,idtache]
    db.query(query,values)
  }
})
/////////////////// get the admin informations and send comment  
// راوت: إحضار idadmin من التوكن
app.post('/getAdminId', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'التوكن مفقود' });
  }

  try {
    // فك تشفير التوكن باستخدام مفتاحك السري
    const decoded = jwt.verify(token, "thissvevehjvebvjehjb43r32r2fbf" );
    const idadmin = decoded.idadmin;

    if (!idadmin) {
      return res.status(401).json({ error: 'التوكن غير صالح' });
    }

    res.json({ idadmin });
  } catch (error) {
    console.error('خطأ في فك تشفير التوكن:', error);
    res.status(401).json({ error: 'التوكن غير صالح' });
  }
});

////////route  to add a  comment about the progress :

app.post("/comment/:idecole/:idadmin", (req,res)=>{
    const {idadmin,idecole,observation} = req.body ;
    if (!idadmin || !idecole) {
         res.status(403).send("one of the ides is not set !")
    }
    else{
        const sqlquery = `insert into visite (datevisite,observation,idadmin,idecole) values(?,?,?,?)`
        const date = new Date();
        const values =[date,observation,idadmin,idecole]
        try{
          db.query(sqlquery,values)
          res.sendStatus(200)
        }
        catch{
          res.status(400).send('erreur !')
        }

    }
})
////////////// route to get rapport from the table visite
app.get('/raportsget', (req, res) => {
  db.query('SELECT  idvisite,datevisite,observation,nomecole,ecole.idecole  from visite inner join ecole on visite.idecole=ecole.idecole', (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error to the console
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});
////////////////// get visite by id
app.get('/raportsget/:idvisite', (req, res) => {
  const{idvisite}=req.params;
  db.query('SELECT idvisite,datevisite,observation,fullname,email,pourcentage FROM admin inner join visite on admin.idadmin=visite.idadmin inner join ecole on visite.idecole=ecole.idecole  where idvisite = ?' ,[idvisite], (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error to the console
      return res.status(500).json({ error: 'Database query failed' });
    }
    
    res.json(results);
  });
});
////////// route to get admin information by id 

app.get('/admin/:id', (req, res) => {
    const { id } = req.params || req.body;
    db.execute('SELECT * FROM admin WHERE idadmin = ?', [id], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ message: 'An internal server error occurred' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(rows[0]);
    });
});
////////// route to get admin information by id  from body for the nav bar admin fetch

app.get('/admin', (req, res) => {
  const { id } = req.body;
  db.execute('SELECT * FROM admin WHERE idadmin = ?', [id], (err, rows) => {
      if (err) {
          console.error('Database query error:', err.message);
          return res.status(500).json({ message: 'An internal server error occurred' });
      }
      if (rows.length === 0) {
          return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json(rows[0]);
  });
});
//////////////////supprimer une visite depuis son id 
app.delete('/visite/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  db.query('DELETE FROM visite WHERE idvisite = ?', [id], (error, result) => {
    if (error) {
      console.error('Error deleting visite:', error);
      return res.status(500).json({ message: 'Failed to delete visite', error });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Visite deleted successfully' });
    } else {
      res.status(404).json({ message: 'Visite not found' });
    }
  });
});
// Route to get all the admins
app.get("/getallAdmins", (req, res) => {
  const sql = "SELECT * FROM admin";

  db.query(sql, (error, results) => {
      if (error) {
          console.error("Error fetching admins:", error);
          return res.status(500).json({ message: "Internal Server Error" });
      }

      res.json(results);
  });
});




/////////////////////////////////
// Bulk delete tasks route (single connection version)
app.delete('/tasks/bulk-delete', (req, res) => {
  const { idecole, taskIds } = req.body;

  if (!idecole || !taskIds || !Array.isArray(taskIds)) {
    return res.status(400).json({
      error: 'Invalid request. Missing school ID or task IDs'
    });
  }

  // Start transaction
  db.beginTransaction((beginErr) => {
    if (beginErr) {
      console.error('Transaction start error:', beginErr);
      return res.status(500).json({ error: 'Transaction failed to start' });
    }

    // Execute delete query
    db.query(
      `DELETE FROM tache 
       WHERE idecole = ? 
       AND idtache IN (?)`,
      [idecole, taskIds],
      (queryErr, result) => {
        if (queryErr) {
          return db.rollback(() => {
            console.error('Delete error:', queryErr);
            res.status(500).json({ error: 'Delete operation failed' });
          });
        }

        // Commit transaction
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              console.error('Commit error:', commitErr);
              res.status(500).json({ error: 'Transaction commit failed' });
            });
          }

          res.json({
            message: `Successfully deleted ${result.affectedRows} tasks`,
            affectedRows: result.affectedRows
          });
        });
      }
    );
  });
});
///////// supprimer un admin

app.delete("/remove/admin/:idadmin",(req,res)=>{
  const {idadmin} = req.params
  if (isNaN(idadmin)) {
      res.sendStatus(401)
      
      
  }
  else{
    const Sqlquery = `delete from admin where idadmin = ?`
    db.query(Sqlquery,[idadmin],(error, results) => {
      if (error) {
          console.error("Error fetching admin:", error);
          return res.status(500).json({ message: "Internal Server Error" });
      }

      res.json(results);
  });
   
  }
  
   
})
/////////// get the admin infor for each visite

app.get("/visite/:idvisite",(req,res)=>{
  const{idvisite}=req.params
  const query = "select fullname,email,nomecole from visite inner join admin on visite.idadmin=admin.idadmin inner join ecole on visite.idecole=ecole.idecole  where idvisite=?";
  
  db.query(query,[idvisite],(error, results) => {
    if (error) {
        console.error("Error fetching admin:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json(results);
 
})
})
app.get("/nbvisites:idecole")
