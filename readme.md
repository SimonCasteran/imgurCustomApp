Epicture

An imgur application





	1. Pre-requisites

To run this project, you need to install android studio and set up your phone with adb.

You need to register an application at https://api.imgur.com/oauth2/addclient to obtain a Client ID and a secret.

	2. Set up the project


Create a .env file in Ymgourre root with your app client ID and secret






Create a file local.properties in Ymgourre/android/local.properties with the location of your Sdk. For me it was sdk.dir=/home/username/Android/Sdk





You will need npm to install dependencies. Open a terminal at Ymgourre then use “npm install”.



	3. Build the apk

Once the dependencies are installed, go inside the android folder with a “cd android” and use “gradle build” to build the apk.

Start android studio, open a project and select the apk in Ymgourre/android/app/build/outputs/apk/release


Click on the green arrow to install the apk on your phone.

	4. Updating the code


If you wish to modify the code, you should use a react native server.



Then in another terminal in the same Ymgourre folder, use “npm run android”. This command will build the apk, put it on your phone and update the apk whenever you change the code.




