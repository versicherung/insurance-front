import React, { useState, useRef } from 'react';
import { history, useRequest } from 'umi';
import { Button, Drawer, message, Spin, Row, Col, Divider, Image } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { order, exportExcel, exportEvidence, exportPolicy, orderDetail } from '@/services/api';

import './index.less';

const DescriptionItem: React.FC<{ title: string; content: string | JSX.Element }> = ({
  title,
  content,
}) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const handleExportExcel = async (
  formRef: React.MutableRefObject<ProFormInstance | undefined>,
  id?: number[],
) => {
  const params: { startTime?: string; endTime?: string; id?: number[] } = {};
  const hide = message.loading('正在导出');

  // 为导出接口添加参数
  if (formRef.current) {
    const fields = formRef.current.getFieldsValue();
    if (fields.startTime) {
      params.startTime = fields.startTime[0].format('YYYY-MM-DD');
      params.endTime = fields.startTime[1].format('YYYY-MM-DD');
    }
  }
  if (id) {
    params.id = [...id];
  }

  try {
    const res = await exportExcel(params);
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.xlsx');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const handleExportEvidence = async (ids: number[]) => {
  const hide = message.loading('正在导出');

  try {
    const res = await exportEvidence({ ids });
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.zip');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const handleExportPolicy = async (ids: number[]) => {
  const hide = message.loading('正在导出');

  try {
    const res = await exportPolicy({ ids });
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.zip');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderListItem[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const {
    data: detailData,
    loading: detailLoading,
    run,
  } = useRequest(orderDetail, { manual: true });

  const columns: ProColumns<API.OrderListItem>[] = [
    {
      title: '车主',
      dataIndex: 'owner',
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity);
              run({ id: record.id });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      hideInSearch: true,
    },
    {
      title: '起保时间',
      dataIndex: 'startTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '车型',
      dataIndex: 'carType',
      search: false,
    },
    {
      title: '付费方式',
      dataIndex: 'payType',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="downloadFile"
          onClick={() => {
            handleExportEvidence([record.id]);
          }}
        >
          下载证明材料
        </a>,
        <a
          key="downloadInsurance"
          onClick={() => {
            handleExportPolicy([record.id]);
          }}
          style={{
            pointerEvents: record.policy ? 'auto' : 'none',
            opacity: record.policy ? 1 : 0.2,
          }}
        >
          下载保单
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.OrderListItem, API.PageParams>
        headerTitle={'顶单列表'}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/order/create');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Button key="out" onClick={() => handleExportExcel(formRef)}>
            导出承保信息
          </Button>,
        ]}
        request={async (params) => {
          const res = await order(params);

          return {
            success: true,
            data: res.data?.items,
            total: res.data?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择&nbsp;
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>
              &nbsp;项
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleExportExcel(
                formRef,
                selectedRowsState.map((item) => item.id),
              );
              setSelectedRows([]);
            }}
          >
            批量导出
          </Button>

          <Button
            onClick={async () => {
              await handleExportEvidence(selectedRowsState.map((item) => item.id));
              setSelectedRows([]);
            }}
          >
            批量导出证明材料
          </Button>
        </FooterToolbar>
      )}
      <Drawer
        visible={showDetail}
        closable={false}
        onClose={() => setShowDetail(false)}
        width={640}
      >
        {detailLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Spin />
          </div>
        )}
        {detailData && (
          <>
            <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
              订单详情
            </p>
            <p className="site-description-item-profile-p">基本信息</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="车主" content={detailData.owner} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="车牌号" content={detailData.licensePlate} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="起保时间" content={detailData.startTime} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="车型" content={detailData.carType} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="付费方式" content={detailData.payType} />
              </Col>
            </Row>

            <Divider />

            {detailData.idCard && (
              <>
                <p className="site-description-item-profile-p">身份证信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="身份号码" content={detailData.idCard.number} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="地址" content={detailData.idCard.address} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="照片"
                      content={<Image height={200} src={detailData.idCard.url} />}
                    />
                  </Col>
                </Row>
              </>
            )}

            {detailData.business && (
              <>
                <p className="site-description-item-profile-p">营业执照信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="身份号码" content={detailData.business.number} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="地址" content={detailData.business.address} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="照片"
                      content={<Image height={200} src={detailData.business.url} />}
                    />
                  </Col>
                </Row>
              </>
            )}

            <Divider />

            {detailData.driving && (
              <>
                <p className="site-description-item-profile-p">行驶证信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="车架号" content={detailData.driving.frame} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="发动机号" content={detailData.driving.engine} />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="车辆类型" content={detailData.driving.type} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="照片"
                      content={<Image height={200} src={detailData.driving.url} />}
                    />
                  </Col>
                </Row>
              </>
            )}

            {detailData.certificate && (
              <>
                <p className="site-description-item-profile-p">车辆合格证信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="车架号" content={detailData.certificate.frame} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="发动机号" content={detailData.certificate.engine} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="照片"
                      content={<Image height={200} src={detailData.certificate.url} />}
                    />
                  </Col>
                </Row>
              </>
            )}

            <Divider />

            {detailData.policy && (
              <>
                <p className="site-description-item-profile-p">出保单信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="保单名称" content={detailData.policy.name} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="保单号" content={detailData.policy.number} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="保单下载"
                      content={
                        <a href={detailData.policy.url} target="_blank">
                          打开
                        </a>
                      }
                    />
                  </Col>
                </Row>
              </>
            )}

            {/*  {detailData.business && (
              <>
                <p className="site-description-item-profile-p">营业执照信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="身份号码" content={detailData.business.number} />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="地址" content={detailData.business.address} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="照片"
                      content={<Image width={200} src={detailData.business.url} />}
                    />
                  </Col>
                </Row>
              </>
            )}

            <p className="site-description-item-profile-p">Contacts</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Email" content="AntDesign@example.com" />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Github"
                  content={
                    <a href="http://github.com/ant-design/ant-design/">
                      github.com/ant-design/ant-design/
                    </a>
                  }
                />
              </Col>
            </Row> */}
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
