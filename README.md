
## Make sure to have Visual Studio Code

1. First Create a Empty Folder, then access that directory before you create the clone. 

2. To access the directory, open the visual studio code, select the File button in the upper left side, click Open Folder, click the Empty Folder you created, then Select Folder it.

3. Once you open it, click the Terminal in one of the button from the upper left side. then type the command :
```bash
  git clone https://github.com/Argusxiii13/NRCPNet.git
```
4. Wait for a while. Once its done, repeat the Step No.2, but access the folder NRCPNet.

5. Once you open it, open the terminal again, but this time, you need 2 terminal at once. You can activate the Split Terminal through the shortcut Ctrl + Shift + 5.

6. Run these command separately at the terminal you opened :

```bash
  npm install
```
```bash
  composer install
```

7. Wait for a while. Watch carefully for any failed installation of modules. If any modules failed to be downloaded/installed, stop in this step.

8. Once the modules have been installed, run this command on one of the terminal :

```bash
cp .env.example .env
```
then this

```bash
php artisan key:generate
```

then this

```bash
php artisan config:clear
```
```bash
php artisan migrate
```

10. After all these, run these command each at the terminal :

```bash
npm run dev
```

```bash
php artisan serve
```


