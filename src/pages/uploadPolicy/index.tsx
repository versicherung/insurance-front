import React from 'react';
import { Card, Divider, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

const UploadPolicy: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Upload>
          <Button>
            <UploadOutlined />
            上传
          </Button>
        </Upload>
      </Card>
      <Divider />
      <ProTable search={false} />
    </PageContainer>
  );
};

export default UploadPolicy;
