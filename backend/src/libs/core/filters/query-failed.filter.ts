import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi cơ sở dữ liệu trên hệ thống.';
    let error = 'Internal Server Error';

    const code = exception.code;
    const detail = exception.detail;

    if (code === '23505') { // unique_violation
      status = HttpStatus.BAD_REQUEST;
      error = 'Bad Request';
      
      if (detail) {
        const match = detail.match(/Key \((.*?)\)=\((.*?)\) already exists/);
        if (match) {
          const field = match[1];
          const value = match[2];
          
          let fieldName = field;
          if (field === 'email') fieldName = 'Email';
          else if (field === 'username') fieldName = 'Tên đăng nhập';
          else if (field === 'tax_code' || field === 'taxCode') fieldName = 'Mã số thuế';
          else if (field === 'code') fieldName = 'Mã';
          
          message = `${fieldName} "${value}" đã tồn tại trong hệ thống.`;
        } else {
          message = `Dữ liệu bị trùng lặp: ${detail}`;
        }
      } else {
        message = 'Dữ liệu đã tồn tại trong hệ thống.';
      }
    } else if (code === '23503') { // foreign_key_violation
      status = HttpStatus.BAD_REQUEST;
      error = 'Bad Request';
      
      if (detail) {
        const match = detail.match(/is still referenced from table "(.*?)"/);
        if (match) {
          const referencedTable = match[1];
          let tableName = referencedTable;
          if (referencedTable === 'users') tableName = 'Người dùng';
          else if (referencedTable === 'enterprises') tableName = 'Doanh nghiệp';
          else if (referencedTable === 'role_permissions') tableName = 'Phân quyền vai trò';
          else if (referencedTable === 'tnld_contract_reports') tableName = 'Báo cáo Tai nạn lao động';
          
          message = `Không thể thực hiện thao tác do dữ liệu đang được liên kết bởi bảng dữ liệu "${tableName}".`;
        } else {
          message = `Không thể xóa hoặc thay đổi dữ liệu do đang có liên kết ràng buộc: ${detail}`;
        }
      } else {
        message = 'Không thể thực hiện thao tác do dữ liệu đang được liên kết với một bảng khác.';
      }
    } else {
      console.error('Unhandled Database Error:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
