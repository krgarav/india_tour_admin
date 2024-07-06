import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableFour from '../components/Tables/TableFour';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import DefaultLayout from '../layout/DefaultLayout';
import TourPackageTable from '../components/Tables/TourPackageTable';

const AllTourPackages = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        {/* <TableOne />
      <TableTwo />
      <TableThree /> */}
        {/* <TableFour /> */}
        <TourPackageTable />
      </div>
    </DefaultLayout>
  );
};

export default AllTourPackages;
