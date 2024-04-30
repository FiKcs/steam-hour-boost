
# Steam Hour Boosting 24/7 with Render

Boosts Hours on Steam. Idles any game in your library. Can be run 24/7 for free with Render.

1. Register at https://render.com
2. Create a new web service & select "Build and deploy from a Git repository"
3. Paste the link of this repository and continue (everything you need to edit are enviourment variables)
4. Enter app name, select node, change build command to "npm install", select free plan and add your enviourment variables:
**"accounts"** - either username:password or username:password:shared_secret. You can add as many accounts as you like, separate them with a comma and a space. "acc1, acc2, .." You can mix shared_secret with non shared_secret accounts.
& **"games"** - id's taken from the steam's game page url (additionally, **"webhook"** - webhook link)
6. Deploy.
7. Go to https://cron-job.org, Sign up, create cronjob, enter a name and the link to your render app, set the interval to 2 minutes.
