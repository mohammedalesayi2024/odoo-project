from odoo import models
from zk import ZK

class AttendanceSync(models.Model):
    _name = 'zk.sync'

    def sync_attendance(self):
        devices = self.env['zk.device'].search([])

        for device in devices:
            try:
                zk = ZK(device.ip, port=device.port)
                conn = zk.connect()
                records = conn.get_attendance()

                for rec in records:
                    employee = self.env['hr.employee'].search([
                        ('barcode', '=', rec.user_id)
                    ], limit=1)

                    if not employee:
                        continue

                    last_att = self.env['hr.attendance'].search([
                        ('employee_id', '=', employee.id),
                        ('check_out', '=', False)
                    ], limit=1, order='check_in desc')

                    if last_att:
                        last_att.check_out = rec.timestamp
                    else:
                        self.env['hr.attendance'].create({
                            'employee_id': employee.id,
                            'check_in': rec.timestamp
                        })

                conn.disconnect()

            except Exception as e:
                print("ZK Error:", e)
