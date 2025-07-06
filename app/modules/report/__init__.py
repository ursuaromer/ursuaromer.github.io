from flask import Blueprint, render_template, request

report_bp=Blueprint('report', __name__)

from . import routes
# Nombre interno del blueprint:  'report'
report_bp = Blueprint(
    "report",                # ← este nombre usarás en url_for('report.reporte')
    __name__,
    template_folder="../../templates"   # sube 2 niveles hasta app/templates
)

@report_bp.route("/reporte")           # URL final = /reporte
def reporte():
    dni   = request.args.get("dni")
    ciclo = request.args.get("ciclo")
    return render_template(
        "main/reporte-de-notas/reporte.html",
        dni=dni,
        ciclo=ciclo
    )

@report_bp.route('/main/reporte-de-notas/alumnacion')
def alumnacion():
    return render_template('main/reporte-de-notas/alumnacion.html')
