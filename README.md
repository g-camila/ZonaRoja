# Zona Roja
URL: https://youtu.be/sxOKWBOot58 Final CS50 final project. A site for users to register crimes and view them in markers and in a colored map, all in Cordoba city. site link: https://zonaroja2.azurewebsites.net/

It is all organized in templates and static folders for Flask to be able to access it all. The javascript and html happens all in one folder because I needed Flask to show up in my script, and thought it more practical to make it all into one. The database works with azure, the whole thing is built upon the google maps API.

The json file containts all the information of the neighborhoods and zones in Cordoba, being its shape (multipolygons), name and an id. It is a geojson file. Originally, I chose google maps to be able to acess that information from the API itself, but as I discovered throughout the project, a lot of services like those are not available for Argentina. I instead used the information that i found on a census that happened this year, and had to learned what was a json to begin with to translate the KML file to one that I could use.

The database in Azure has three tables, one with all of the cases, other two with the names of all the time frames and crimes. I tried my best two put all of the crimes that I think happen most often in a way it is not confusing. For the same pourpuses, I choose time periods instead of a specific time (hour, minutes) as I don't think most will be able to remember that when getting robbed.

I believe, hypothetically, that the database created could be useful to analyze, to get results and conclusions faster than right now, and provide better services for the safety in my city. I also did this in english only for everyone to be able to understand my site more thoroughly, but for it to work in my hometown I would need to translate it to spanish, as I originally wrote it.

Thank you very much CS50.