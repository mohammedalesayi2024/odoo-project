from odoo import models, fields

class ZKDevice(models.Model):
    _name = 'zk.device'
    _description = 'ZKTeco Device'

    name = fields.Char(required=True)
    ip = fields.Char(required=True)
    port = fields.Integer(default=4370)
