import express, { query } from "express"
import multer from "multer";
import mysql from "mysql2"
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect } from "http2";
const app = express();

const PORT = 3999;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school1",
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
app.use(cors());
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
app.post("/add-school", upload.single("image"), (req, res) => {
  const { nomecole, dd_construction, adress, statut, type ,direction} = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate required fields
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

// راوت لعرض مدرسة معينة بناءً على id
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
        res.status(200).json(result[0]); // إرسال تفاصيل المدرسة
      }
    });
  });
// راوت لعرض جميع المدارس
app.get("/schools", (req, res) => {
    const query = "SELECT * FROM ecole";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// بدء تشغيل السيرفر



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
  // Route لإضافة المهمة
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

  // إرجاع استجابة عند الانتهاء من إضافة المهام
  res.status(200).json({ message: 'تم إضافة المهام بنجاح' });
});


//////////////////// check if task already exists


// Route لجلب المهام المدخلة مسبقًا
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
//////////////////// Add user route 

// Add Admin Route
app.post('/add-admin', async (req, res) => {
  const { fullname, email, pwd } = req.body;

  if (!fullname || !email || !pwd) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(pwd, 10);

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

  // Query to find the user by email
  const sql = 'SELECT * FROM admin WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = results[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(pwd, admin.pwd);
 if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const key = 'thissvevehjvebvjehjb43r32r2fbf' 
    const token = jwt.sign(
      { idadmin: admin.idadmin, email: admin.email }, // Payload
      key, // Secret key (Use an environment variable in production)
      // Token expiration time (optional, here it's set to 1 hour)
    );

    // Successful login with token
   
    res.status(200).json({
      message: 'Login successful',
      token, // Send the token to the frontend
      admin: {
        idadmin: admin.idadmin,
        fullname: admin.fullname,
        email: admin.email,
      },
    });
  });
});
////////////////////// midlware to assure the user autentication first 

 // Middleware to protect routes
const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
 jwt.verify(token, 'thissvevehjvebvjehjb43r32r2fbf', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Attach the user data (from the token) to the request object
    next(); // Proceed to the next middleware or route handler
  });
  
};
/////////////////// update schoole infos




app.put("/school/:idecole", (req, res) => {
  const { idecole } = req.params;
  const { nomecole, adress, statut, pourcentage ,typeecole} = req.body;

  // Validate input
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

    // Successful update
    res.status(200).json({ message: "School information updated successfully." });
  });
});
////////// Ajouter user



app.post("/ajouterUser" ,(req, res) => {
  const { nomemployer, login, pwd, poste } = req.body;

  // Make sure the input values are provided
  if (!nomemployer || !login || !pwd || !poste) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // SQL query with placeholders to avoid SQL injection
  const query = `
    INSERT INTO employer(nomemployer, login, pwd, employer_poste)
    VALUES (?, ?, ?, ?)
  `;

  // Values to be inserted into the query
  const values = [nomemployer, login, pwd, poste];

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      // If an error occurs during the query execution
 console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Failed to add user. Please try again later." });
    }

    // Respond with success if the query is executed correctly
    return res.status(201).json({ message: "User added successfully", userId: result.insertId });
  });
});
////////////////////// add images


// راوت لتحميل الصورة


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



// Route pour récupérer les images d'une école
app.get("/ecoles/:idecole/images", (req, res) => {
  const idecole = req.params.idecole;

  // Vérification de l'id
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

//////// to add a  comment about the progress :

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


// Route to get all data from the "visite" table
app.get('/raportsget', (req, res) => {
  db.query('SELECT * FROM visite', (err, results) => {
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
  db.query('SELECT * FROM visite where idvisite = ?' ,[idvisite], (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error to the console
      return res.status(500).json({ error: 'Database query failed' });
    }
    
    res.json(results);
  });
});
////////// route to get admin information by id 


app.get('/admin/:id', (req, res) => {
    const { id } = req.params;
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
  const id = parseInt(req.params.id); // Extract and parse the visite ID from the URL

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  // Query to delete the visite by ID
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