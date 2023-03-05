import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link href="/">
        {collapsed ? (
          <img src="/refine-collapsed.svg" alt="Refine" width="28px" />
        ) : (
          <img src="/logo-white.svg" alt="Refine" width="140px" />
        )}
      </Link>
    </Button>
  );
};
