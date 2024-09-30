# Creating a New iTELL Deployment/Volume
This guide aims to create an up to date guideline of how to create new instances of iTELL Volumes avaiable on the web.

## Content Manage System

The first step is to create a new Volume inside of the Strapi Administration Panel. The admin panel can be found [here](https://itell-strapi-um5h.onrender.com/admin) and you can log in using the email and password assigned to you. If you are a lab member and do not have a Strapi login, contact someone to get an invite link. 

Once you're inside of the admin panel, click the "Content Manager" on the left and "Volumes." Check that the volume you are intending to create has not already been added to the CMS. 

For inputting content into Strapi, please see this guide: [Insert Style Guide Here]

## New Github Volume Directory
Next, clone the [itell-strapi-demo](https://github.com/learlab/itell-strapi-demo) repository. This is the repository that contains all the code for the volumes. Make a copy of the contents of the folder `/apps/cttc-poe` as this is the example textbook. Rename the folder to match your Volume name and push it to the Github. 

This will currently have the same settings and content as the `cttc-poe` volume, but this will be changed later in the process. 

## Render Environment Variable Update
In order for the content that you created in Strapi to be reflected in the new repository directory you just made, a new location needs to be added to the Strapi deployment. Log into [Render](https://dashboard.render.com/login?next=%2Fweb%2Fsrv-cl4s83al7jac73c6g2ag%2Fdeploys%2Fdep-cqcpro3v2p9s73e1uvqg), open the Environment tab on the left, and scroll down to secret file and click edit. In the second to last environment variable, there is an array of JSON objects that represent some information about the places to push code to. If the location of the repository is still in the LearLab itell-strapi-demo repository, the only things that need to change are the `dir` field where you change the path to the `content/textbook` directory under the textbook you just created and the `text` field which is going to be the displayed name on Strapi for pushing the content. It is suggest to match this to the Volume name in Strapi. 

Append the new JSON object to the array and then save and redeploy the Render instance. 

## Pushing Content to Volume
Once the Render instance has been redeployed, the administration panel will have your new text as an option in the dropdown menu present in the "Github Publish" tab. Select your textbook and click publish, waiting for it to finish running. Now, navigate to your textbook directory in the Github repository to verify that the content is published and not malformed. 

## Local Testing 
[Insert instructions for local setup and running including setting up the env file]

## Database Setup
In order to store user data, a Postgress database needs to be set up in [Supabase](https://supabase.com/) specific to the volume. 

Log into Supabase and create a new database. It will ask you to create a password. Save this password somewhere safe as you will not see this again. 

Then, once the database is set up, go to database settings and get the database access url. Retrieve the one that is marked for node.js. You will use this link to set up the online deployment in the next step. 

## Vercel Setup

Once the volume has been verified locally, it's time to add it online. To get a Volume online, you need to deploy it into Vercel. This will require access to the lab's Vercel account, which you may inquire about a login token for. Then, add new, add a project, and select the itell-strapi-demo repository. Set the path that contains the Volume information in the /apps folder as the `root`.  Make sure that the `install` command is overridden as `pnpm install` and the `build` command is overridden as `turbo run build --filter @itell/{volume-directory-name}`. 

Then, add the environment variables from the setup locally to the environment variables field. You should be able to simply copy and paste the whole file in and Vercel will add each field correctly. 

Then, create the deployment and make sure that it is successfully built and deployed. 

## Setting Up Logins
At this point, the volume is almost set up. You will be able to navigate to the link provided by the Vercel deployment to see the volume online. However, when you try to log in, it does not allow it. This is because we need to add the application to the authentication methods. 

### Google Login
Log into the Google Console [LINK NEEDED] and log in using the lab Gmail account. Then, under the area where it has the allowed domains, add the new link Vercel gave you. Scroll down further and add the redirect link to the section below (follow the pattern of the other entires). 

### Outlook
[INSTRUCTIONS NEEDED HERE]

## Wrapup
And that's it. Your iTELL deployment has now been created. It should allow automatic content publishing from the CMS as well as logins via Google and Outlook. 