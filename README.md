# NRCPNet
For DOST NRCP Intranet

1. First Create a Empty Folder, then access that directory before you create the clone. 
2. Simply open the visual studio code, select the File button in the upper left side, click Open Folder, click the Empty Folder you created, then Select Folder it.
3. Once you open it, click the Terminal in one of the button from the upper left side. then type the command :

git clone https://github.com/Argusxiii13/NRCPNet.git

4. Wait for a while. Once its done, repeat the step two, to access the folder NRCPNet.
5. Once you open it, open the terminal again, but this time, you need 2 terminal at once. You can activate the Split Terminal through the shortcut Ctrl + Shift + 5.
6. Run these command at the terminal you opened :

npm install

composer install

7. Wait for a while. Watch carefully for any failed installation of modules. If any modules failed to be downloaded/installed, stop in this step.
8. Once the modules have been installed, run this command on one of the terminal :

cp .env.example .env
then this 
php artisan key:generate

9. Run these command each at the terminal :

npm run dev

php artisan serve