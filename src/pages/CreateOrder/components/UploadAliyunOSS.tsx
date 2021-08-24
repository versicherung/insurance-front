import React, { useState, useImperativeHandle } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadFileStatus,
} from 'antd/lib/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import client from '@/services/aliyun';

const UploadButton: React.FC<{ loading?: boolean }> = ({ loading }) => (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const UploadAliyunOSS: React.FC<{
  namespace: string;
  ocrCallback: (res: any) => Promise<any>;
  ref: any;
}> = React.forwardRef((props, ref) => {
  const { namespace, ocrCallback } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useImperativeHandle(ref, () => {
    return {
      setFileList,
    };
  });

  const handleOnChange: (info: UploadChangeParam<UploadFile<any>>) => void = ({ file }) => {
    if (file.status === 'removed') {
      setFileList([]);
    }
  };

  const beforeUpload: (file: RcFile, FileList: RcFile[]) => boolean = (file) => {
    // 限制图片 格式、size、分辨率
    const isJPG = file.type === 'image/jpg';
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 1;

    if (!(isJPG || isJPEG || isPNG)) {
      message.error({
        title: '只能上传JPG、JPEG、PNG格式的图片~',
      });
    } else if (!isLt2M) {
      message.error({
        title: '图片超过1M限制，不允许上传~',
      });
    }

    return (isJPG || isJPEG || isPNG) && isLt2M;
  };

  const customRequest: (options: UploadRequestOption) => any = (opt) => {
    const { file } = opt;

    const imgItem = {
      uid: '-1',
      name: 'hehe.png',
      status: 'uploading' as UploadFileStatus,
      url: '',
      percent: 99,
    };

    setFileList([imgItem]);

    if (file instanceof File) {
      const name = file.name.split('.');
      const fix = name[name.length - 1];

      client
        .put(`${namespace}/${name[name.length - 2]}-${uuidv4()}.${fix}`, file)
        .then((res) => {
          return ocrCallback(res);
        })
        .then((res) => {
          const imgRes = {
            uid: '-1',
            name: res.name,
            status: 'done' as UploadFileStatus,
            url: res.url,
          };

          setFileList([imgRes]);
        })
        .catch(() => {
          setFileList([]);
          message.error('图片上传失败请稍后再试');
        });
    }
  };

  return (
    <Upload
      listType="picture-card"
      className="primary-uploader"
      fileList={fileList}
      onChange={handleOnChange}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
    >
      {fileList.length === 0 && <UploadButton />}
    </Upload>
  );
});

export default UploadAliyunOSS;
