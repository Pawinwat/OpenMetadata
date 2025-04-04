/*
 *  Copyright 2024 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import React, { useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { EntityTabs } from '../../../enums/entity.enum';
import { PageType, Tab } from '../../../generated/system/ui/page';
import { useCustomPages } from '../../../hooks/useCustomPages';
import { useGridLayoutDirection } from '../../../hooks/useGridLayoutDirection';
import { WidgetConfig } from '../../../pages/CustomizablePage/CustomizablePage.interface';
import {
  getDefaultWidgetForTab,
  getWidgetsFromKey,
} from '../../../utils/CustomizePage/CustomizePageUtils';

const ReactGridLayout = WidthProvider(RGL);

interface GenericTabProps {
  type: PageType;
}

export const GenericTab = ({ type }: GenericTabProps) => {
  const { customizedPage } = useCustomPages(type);
  const { tab } = useParams<{ tab: EntityTabs }>();

  const layout = useMemo(() => {
    if (!customizedPage) {
      return getDefaultWidgetForTab(type, tab);
    }

    if (customizedPage) {
      return tab
        ? customizedPage.tabs?.find((t: Tab) => t.id === tab)?.layout
        : customizedPage.tabs?.[0].layout;
    } else {
      return getDefaultWidgetForTab(type, tab);
    }
  }, [customizedPage, tab, type]);

  const widgets = useMemo(() => {
    return layout?.map((widget: WidgetConfig) => {
      return (
        <div
          className="overflow-auto-y"
          data-grid={widget}
          id={widget.i}
          key={widget.i}>
          {getWidgetsFromKey(type, widget)}
        </div>
      );
    });
  }, [layout, type]);

  // call the hook to set the direction of the grid layout
  useGridLayoutDirection();

  return (
    <ReactGridLayout
      className="grid-container"
      cols={8}
      isDraggable={false}
      isResizable={false}
      margin={[16, 16]}
      rowHeight={100}>
      {widgets}
    </ReactGridLayout>
  );
};
