import { Button, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

const FilterDateMenu = () => {
  return (
    <Menu shadow="md" width={180}>
      <Menu.Target>
        <Button variant="subtle" rightSection={<IconChevronDown size={14} />}>
          Aujourd'hui: 25 Juillet
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Aujourd'hui</Menu.Item>
        <Menu.Item>Hier</Menu.Item>
        <Menu.Item>Les 07 derniers jours</Menu.Item>
        <Menu.Item>Les 30 derniers jours</Menu.Item>
        <Menu.Item>Ce mois</Menu.Item>
        <Menu.Item>Le mois dernier</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterDateMenu;
