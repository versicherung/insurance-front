import React, { useState, useRef } from 'react';
import { history } from 'umi';
import { Button, message } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { order, exportExcel } from '@/services/api';

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

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderListItem[]>([]);

  const columns: ProColumns<API.OrderListItem>[] = [
    {
      title: '车主',
      dataIndex: 'owner',
      hideInSearch: true,
      render: (dom) => {
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity);
              // setShowDetail(true);
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
        <a key="downloadFile">下载附件</a>,
        <a
          key="downloadInsurance"
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
            导出全部
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
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
