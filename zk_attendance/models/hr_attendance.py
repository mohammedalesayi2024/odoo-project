from odoo import models, fields, api
from datetime import datetime, time

class HrAttendance(models.Model):
    _inherit = 'hr.attendance'

    late_minutes = fields.Integer(compute='_compute_values', store=True)
    work_hours = fields.Float(compute='_compute_values', store=True)

    @api.depends('check_in', 'check_out')
    def _compute_values(self):
        WORK_START = time(8, 0)

        for rec in self:
            rec.work_hours = 0
            rec.late_minutes = 0

            if rec.check_in and rec.check_out:
                delta = rec.check_out - rec.check_in
                rec.work_hours = delta.total_seconds() / 3600

            if rec.check_in:
                start_dt = datetime.combine(rec.check_in.date(), WORK_START)
                if rec.check_in > start_dt:
                    late = rec.check_in - start_dt
                    rec.late_minutes = int(late.total_seconds() / 60)
