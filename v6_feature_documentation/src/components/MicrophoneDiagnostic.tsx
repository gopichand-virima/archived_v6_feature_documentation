/**
 * Microphone Diagnostic Tool
 * Helps users troubleshoot microphone permission issues
 */

import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Mic, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  solution?: string;
}

export function MicrophoneDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check if API is supported
    diagnosticResults.push({
      name: "Browser Support",
      status: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'pass' : 'fail',
      message: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        ? "✅ Your browser supports microphone access"
        : "❌ Your browser doesn't support getUserMedia API",
      solution: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        ? undefined
        : "Update your browser to the latest version or use Chrome, Firefox, or Edge"
    });

    // Test 2: Check HTTPS
    const isSecure = window.isSecureContext || window.location.hostname === 'localhost';
    diagnosticResults.push({
      name: "Secure Context",
      status: isSecure ? 'pass' : 'fail',
      message: isSecure
        ? "✅ Running on HTTPS or localhost"
        : "❌ Not using HTTPS - microphone requires secure connection",
      solution: isSecure
        ? undefined
        : "Access the site via HTTPS or use localhost for development"
    });

    setResults([...diagnosticResults]);

    // Test 3: Check permission state (Chrome/Firefox)
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionResult = await navigator.permissions.query({ 
          name: 'microphone' as PermissionName 
        });
        
        let status: 'pass' | 'fail' | 'warning' = 'warning';
        let message = '';
        let solution = '';

        switch (permissionResult.state) {
          case 'granted':
            status = 'pass';
            message = '✅ Microphone permission is granted';
            break;
          case 'denied':
            status = 'fail';
            message = '❌ Microphone permission was denied';
            solution = 'Click the lock icon in your address bar → Find "Microphone" → Change to "Allow" → Refresh page';
            break;
          case 'prompt':
            status = 'warning';
            message = '⚠️ Permission not decided yet (will prompt on use)';
            solution = 'Click the microphone icon to trigger permission dialog';
            break;
        }

        diagnosticResults.push({
          name: "Permission State",
          status,
          message,
          solution
        });
      } else {
        diagnosticResults.push({
          name: "Permission State",
          status: 'warning',
          message: '⚠️ Cannot query permission state (Safari/older browser)',
          solution: 'Try clicking the microphone icon - dialog should appear'
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: "Permission State",
        status: 'warning',
        message: '⚠️ Permission API not fully supported',
        solution: 'This is normal for Safari - try clicking the microphone icon'
      });
    }

    setResults([...diagnosticResults]);

    // Test 4: Try to access microphone (actual test)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      diagnosticResults.push({
        name: "Microphone Access",
        status: 'pass',
        message: '✅ Successfully accessed microphone!',
        solution: 'Everything is working! You can now use voice input.'
      });

      // Clean up - stop the stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      let errorMessage = '';
      let solution = '';

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = '❌ Permission denied - you clicked "Block" or it was previously denied';
            solution = 'Click lock icon in address bar → Microphone → Allow → Refresh page';
            break;
          case 'NotFoundError':
            errorMessage = '❌ No microphone found';
            solution = 'Connect a microphone or check if your device has one';
            break;
          case 'NotReadableError':
            errorMessage = '❌ Microphone is in use by another application';
            solution = 'Close other apps (Zoom, Teams, Skype) and try again';
            break;
          case 'SecurityError':
            errorMessage = '❌ Security error - likely not HTTPS';
            solution = 'Use HTTPS or localhost';
            break;
          default:
            errorMessage = `❌ Error: ${error.message}`;
            solution = 'Check browser console for more details';
        }
      } else {
        errorMessage = '❌ Unknown error occurred';
        solution = 'Try refreshing the page or restarting your browser';
      }

      diagnosticResults.push({
        name: "Microphone Access",
        status: 'fail',
        message: errorMessage,
        solution
      });
    }

    setResults([...diagnosticResults]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-300';
      case 'fail':
        return 'bg-red-50 border-red-300';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const overallStatus = results.length > 0
    ? results.some(r => r.status === 'fail')
      ? 'fail'
      : results.some(r => r.status === 'warning')
      ? 'warning'
      : 'pass'
    : 'pending';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl text-black-premium mb-2 flex items-center gap-2">
          <Mic className="h-6 w-6" />
          Microphone Diagnostic Tool
        </h2>
        <p className="text-sm text-slate-600">
          Run this test to check if your microphone is properly configured and accessible.
        </p>
      </div>

      <div className="mb-6">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Run Microphone Test
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <>
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border-2 mb-4 ${getStatusColor(overallStatus)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              <p className="text-sm">
                {overallStatus === 'pass' && (
                  <strong className="text-green-900">All tests passed! ✅ Voice input is ready to use.</strong>
                )}
                {overallStatus === 'warning' && (
                  <strong className="text-yellow-900">Some warnings found. Voice input may work but check details below.</strong>
                )}
                {overallStatus === 'fail' && (
                  <strong className="text-red-900">Issues detected. Follow the solutions below to fix them.</strong>
                )}
              </p>
            </div>
          </div>

          {/* Individual Test Results */}
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {result.name}
                    </p>
                    <p className="text-sm text-slate-700 mb-2">
                      {result.message}
                    </p>
                    {result.solution && (
                      <div className="bg-white bg-opacity-60 rounded p-2 border border-current border-opacity-20">
                        <p className="text-xs font-medium text-slate-800 mb-1">
                          💡 Solution:
                        </p>
                        <p className="text-xs text-slate-700">
                          {result.solution}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          {overallStatus === 'fail' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <p className="text-sm text-blue-900 mb-3">
                <strong>Need help fixing these issues?</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open('/docs/RESET-MICROPHONE-PERMISSION.md', '_blank')}
                >
                  📖 View Setup Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open('/docs/MICROPHONE-PERMISSIONS.md', '_blank')}
                >
                  🔧 Troubleshooting Guide
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
