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
cnxn= urllib.parse.quote_plus('DRIVER={SQL Server};SERVER='+serverdb+';DATABASE='+database+';UID='+username+';PWD='+ password)
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
    big_query = "SELECT * FROM casos"
    casos = pd.read_sql(big_query, engine)

    d_query = "SELECT * FROM delitos"
    delitos = pd.read_sql(d_query, engine)

    p_query = "SELECT * FROM periodo"
    periodo = pd.read_sql(p_query, engine)

    xx = "SELECT id_barrio, SUM(1) AS riesgo FROM casos GROUP BY id_barrio"
    riesgo=pd.read_sql(xx, engine)

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


    jriesgo = riesgo.to_json(orient = "records")
    
    print(jriesgo)
    return render_template("map_2.html", casos=casos, delitos=delitos, periodo=periodo, riesgo=jriesgo)
    #return redirect(request.referrer)

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

