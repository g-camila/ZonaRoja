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
    big_query = "SELECT * FROM delitos"
    casos = pd.read_sql(big_query, engine)

    d_query = "SELECT * FROM delitos"
    delitos = pd.read_sql(d_query, engine)

    p_query = "SELECT * FROM periodo"
    periodo = pd.read_sql(p_query, engine)

    #Request.
    if request.method == "POST":
        if not request.form.get("masc"):
            sex = request.form.get("fem")
        else:
            sex = request.form.get("masc")
            fecha = request.form.get("start")
            crimen = request.form.get("crimen")
            tiempo = request.form.get("horario")
            loc = request.form.get("coordenadas")
            idbarr = request.form.get("barrio_id")

        ##, el barrio en el que se selecciona, y las coordenadas actuales
        ##AGREGAR BARRIO AL FORM Y AUTORELLENAR SU VALOR, USAR LA IDE DE GOOGLE
        ##AGREGAR COORDENADAS AL FORM Y AUTORELLENAR SU VALOR USANDO LAS COORDENADAS ACTUALES QUE YA SABE MI JAVASCRIPT


        insertar = "INSERT INTO casos (fecha, sexo, periodo_id, delito_id, lugar, id_barrio) VALUES ('{}', '{}','{}', '{}','{}', '{}')".format(fecha, sex, tiempo, crimen, loc, idbarr)
        engine.execute(insertar)

        q = "SELECT * FROM casos"
        datos = pd.read_sql(q, engine)

        jdatos=datos.to_json()
        print(jdatos)


    return render_template("map_2.html", casos=casos, delitos=delitos, periodo=periodo)