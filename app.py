import os

from flask import Flask, flash, redirect, render_template, request
#from urllib import request
#import pyodbc
import sqlalchemy as sqla
import urllib
import pandas as pd


serverdb = 'eikonweb.eastus.cloudapp.azure.com' 
database = 'registros' 
username = 'sa' 
password = 'Dycsa0000' 
cnxn= urllib.parse.quote_plus('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+serverdb+';DATABASE='+database+';UID='+username+';PWD='+ password)
engine = sqla.create_engine('mssql+pyodbc:///?odbc_connect={}'.format(cnxn))

app = Flask(__name__)

app.config["TEMPLATES_AUTO_RELOAD"] = True

if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
def map_2():
    #big_query = "SELECT * FROM casos"
    #casos = pd.read_sql(big_query, engine)

    d_query = "SELECT * FROM delitos"
    delitos = pd.read_sql(d_query, engine)

    p_query = "SELECT * FROM periodo"
    periodo = pd.read_sql(p_query, engine)

    #Request.
    if request.method == "POST":
        sex=request.form.get("sexo")
        fecha=request.form.get("dia")
        crimen=request.form.get("crimen")
        tiempo=request.form.get("horario")
        loc=request.form.get("coordenadas")
        idbarr=request.form.get("barrio_id")

        insertar = "INSERT INTO casos (lugar, fecha, periodo_id, delito_id, sexo, id_barrio) VALUES ('{}', '{}','{}', '{}','{}', '{}')".format(loc, fecha, tiempo, crimen, sex, idbarr)
        engine.execute(insertar)


    xx = "SELECT id_barrio, SUM(1) AS riesgo FROM casos GROUP BY id_barrio"
    riesgo=pd.read_sql(xx, engine)
    jriesgo = riesgo.to_json(orient = "records")

    yy = 'SELECT casos.*, \
    casos.id AS casos_id, periodo.nombre AS periodo_nombre, delitos.nombre AS delitos_nombre \
    FROM casos JOIN periodo ON casos.periodo_id=periodo.id \
    JOIN delitos ON casos.delito_id=delitos.id'
    joined_tables=pd.read_sql(yy, engine)
    ammount = joined_tables.shape[0]

    return render_template("map_2.html", casos=joined_tables, delitos=delitos, periodo=periodo, riesgo=jriesgo, am_casos=ammount)#, joined_t=joined_tables)
    #return redirect(request.referrer)
if __name__=="__main__":
    #from waitress import serve
    #serve(app, host="0.0.0.0", port=8080)
    app.run(host="0.0.0.0", port=5000)

#@app.route("/insert_sql", methods=["GET", "POST"])
#def insert_sql():
    #Request.
    #if request.method == "POST":
    #sex=request.args.get("sexo")
    #fecha=request.args.get("dia")
    #crimen=request.args.get("crimen")
    #tiempo=request.args.get("horario")
    #loc=request.args.get("coordenadas")
    #idbarr=request.args.get("barrio_id")

    #insertar = "INSERT INTO casos (lugar, fecha, periodo_id, delito_id, sexo, id_barrio) VALUES ('{}', '{}','{}', '{}','{}', '{}')".format(loc, fecha, tiempo, crimen, sex, idbarr)
    #engine.execute(insertar)


    #q = "SELECT * FROM casos"
    #datos = pd.read_sql(q, engine)

    #jdatos=datos.to_json()
    #print(jdatos)

    #return render_template("map_2.html")

