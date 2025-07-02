from flask import Flask
from app.modules.report import report_bp

@report_bp.route('/report')
def reporte():
    
    return 'esta es la pagina de reportes'
