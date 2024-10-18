import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { UpOutlined } from '@ant-design/icons';
import { IconFont } from '../../../component/icon-font';
import { getAntdDropdownMenu, getAntdItem } from './video-footer-utils';
const { Button: DropdownButton } = Dropdown;
const { Item: MenuItem } = Menu;
interface LeaveButtonProps {
  onLeaveClick: () => void;
  onEndClick: () => void;
  isHost: boolean;
}

const LeaveButton = (props: LeaveButtonProps) => {
  const { onLeaveClick, onEndClick, isHost } = props;

  return isHost ? (
    <button
      className=" ml-[20px] flex justify-center relative items-center h-[3.75rem] w-[7em] bg-[#FF4949] text-[1rem] font-[600] text-[#FFFF] rounded-[3.7rem]"
      onClick={onEndClick}
    >
      End Call
    </button>
  ) : (
    <button
      className="ml-[20px] flex justify-center relative items-center h-[3.75rem] w-[7em] bg-[#FF4949] text-[1rem] font-[600] rounded-[3.7rem] text-[#FFFF] "
      onClick={onLeaveClick}
    >
      End Call
    </button>
  );
};

export { LeaveButton };
