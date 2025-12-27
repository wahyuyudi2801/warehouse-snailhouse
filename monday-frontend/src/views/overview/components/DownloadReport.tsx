import { Button } from "@/components/ui/button";
import { ArrowRightIcon, DownloadIcon } from "lucide-react";

const DownloadReport = () => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-4">
      <div>
        <div className="bg-gray-500/15 rounded-full inline-block p-3">
          <DownloadIcon width={18} height={18} className="text-blue-800" />
        </div>
      </div>
      <div className="mt-4 text-left">
        <div className="text-sm font-semibold text-blue-800 mb-2">
          &mdash; Download Report
        </div>
        <h2 className="text-lg font-extrabold mb-4">
            Download your sales summary instantly
        </h2>
        <Button variant={'outline'} className="text-blue-600 font-semibold bg-blue-600/5 w-full flex justify-between cursor-pointer hover:text-blue-800">
            <span>Download Now</span>
            <ArrowRightIcon/>
        </Button>
      </div>
    </div>
  );
};

export default DownloadReport;
