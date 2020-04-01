# instagram-posts-report
Nodejs script to collect url, date time and likes from all posts a specific user.

The script will scroll down all profile user page to revel every post, collecting each url post. Then, the script will vivist all the urls to collect datetime and likes.

At the end it will generate a csv report with this data: url, datetime and likes.

The script will take a lot o time to finish because it have a 1.5s delay visiting each post link.
If you feel confortable that Instgaram will not detect the script, you could change the delay_visit variable.
