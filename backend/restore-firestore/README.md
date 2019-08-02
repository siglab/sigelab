<h3 align="center">SigeLAB: Database backup tool</h3>



---

<p align="center">
  This is the SigeLAB main database backup tool. Your will need to restore the existent backup in order to build a new instance of the project. This backup contains the basic data to ensure that the application works after you build it.
    <br>
</p>

## 📝 Table of Contents
- [Getting Started](#getting_started)
- [Testing](#tests)


## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will let you use the tool to restore the needed data to boot up SigeLAB or create a new database backup if needed.

### Repository structure
    restore-firestore/
      config.js
      createBackup.js
      restoreBackup.js
      README.md

### Usage
This guide assumes that you already have a firebase project created and firestore activated on it as your main database.

#### Backup restoration process

1. Generate your admin service account key for your firabase project from google console. To generate those keys [check this out](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) and follow those steps.
2. Rename the file you got from the previous step to ```credentials.json``` and place it in the root this folder (this folder will be know just as root folder from now).
3. Modify the firebase [config](./config.js) file with the database URL given for your a web application. Your databse url config line should look something like:
    ```
    const DATABASE_URL = 'https://yourdomain.firebaseio.com';
    ```
4. Execute in the root folder the command ```npm install```.
5. Execute in the root folder the command ```node restoreBackup.js```.

#### Backup creation process

Notice: This process will replace and/or override any ```backup.json``` file existent in the root folder.

1. Follow the steps 1 to 4 of the "Backup restoration process".
2. Execute in the root folder the command ```node createBackup.js```.


## 🔧 Running the tests <a name = "tests"></a>
No automated test has been provided for this project at the current state. We are looking to improve this. If you want to contribute to this project in this topic just let us know.
